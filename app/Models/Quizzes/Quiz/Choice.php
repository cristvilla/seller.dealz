<?php

namespace App\Models\Quizzes\Quiz;

use App\Models\Model;
use DOMDocument;
use DOMXPath;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;

/**
 * Class Choice
 *
 * @package App\Models\Quiz
 *
 * @property string $id          Unique ID generated by the system on creation.
 * @property string $choice      The choice of the question.
 * @property int    $is_correct  An attribute if the choice is a correct answer.
 * @property int    $points      Points earned when selected as the correct choice.
 * @property string $question_id The Question ID.
 * @property int    $ordering    The sort order.
 * @property string $ud          Unique ID used for Vue JS sorting.
 * @property string $letter      Assigned letter.
 * @property string $wrapped
 * @property int    $word_count
 *
 * @method static Choice find(int $id)
 * @method static Choice findOrFail(int $id)
 *
 * @method static Choice[] get()
 *
 * @method static QueryBuilder|Choice ofQuestion(string $id)
 * @method static QueryBuilder|Choice ofCorrect(string $operator = '=', int $count = 1)
 */
class Choice extends Model
{

    const PATH = '';
    const SLUG = 'choice';

    protected $table = 'quizzes_quizzes_choices';

    protected $casts = [
        'is_correct' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected $fillable = [
        'letter',
        'choice',
        'is_correct',
        'points',
        'ordering',
    ];

    protected $hidden = [
        'question_id',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $appends = [
        'ud',
    ];

    public $word_count = 0;

    /**
     * Scope a query to specify sections of a given Question ID.
     *
     * @param  QueryBuilder  $query
     * @param  string        $questionId
     *
     * @return QueryBuilder
     */
    public function scopeOfQuestion($query, $questionId)
    {
        return $query->where('question_id', '=', $questionId);
    }

    /**
     * @param  QueryBuilder  $query
     * @param  string        $operator
     * @param  int           $count
     *
     * @return mixed
     */
    public function scopeOfCorrect($query, $operator = '=', $count = 1)
    {
        return $query->where('is_correct', $operator, $count);
    }

    /**
     * An accessor method to get the unique ID. This is served as a key for
     * sorting items in the Vue JS framework, as empty key will lead into issues
     * on sorting.
     *
     * Usage: $choice->ud
     *
     * @return string
     */
    public function getUdAttribute()
    {
        return $this->generateUd();
    }

    public function getWrappedAttribute()
    {

        $content = mb_convert_encoding($this->choice, 'HTML-ENTITIES', mb_detect_encoding($this->choice));
        $content = '<div class="dom-body">' . $content . '</div>';

        $dom = new DOMDocument('1.0', 'UTF-8');
        $dom->loadHTML($content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);

        $xpath = new DOMXPath($dom);
        $nodes = $xpath->evaluate("//div[@class=\"dom-body\"]");
        $this->traverseNodes($dom, $nodes[0], $this->id);

        $content = $dom->saveHTML();
        $content = preg_replace('/(\[span)(.*?)(\])(.*?)(\[\/span\])/', '<span $2>$4</span>', $content);

        return $content;
    }

    /**
     * @param  DOMDocument  $dom
     * @param  \DOMNode     $node
     * @param  string       $choice_id
     */
    protected function traverseNodes($dom, $node, $choice_id)
    {
        if ($node->hasChildNodes()) {
            foreach ($node->childNodes as $childNode) {
                $this->traverseNodes($dom, $childNode, $choice_id);
            }
        } else {
            if ($node->nodeType == XML_TEXT_NODE) {
                $text = $node->nodeValue;

                $pattern = '/\'?\w+([-\'’\x{02bb}]\w+)*\'?/u';
                $text    = preg_replace_callback(
                    $pattern,
                    function ($matches) use ($choice_id) {
                        $this->word_count++;

                        return '[span data-choice-id="' . $choice_id . '" data-word-id="' . $this->word_count . '" class="s-text"]' . $matches[0] . '[/span]';
                    },
                    $text
                );

                $node->nodeValue = $text;
            }
        }
    }
}